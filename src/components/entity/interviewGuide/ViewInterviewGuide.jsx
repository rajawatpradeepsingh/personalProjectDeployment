import { useEffect, useCallback, useState ,useMemo} from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import auth from "../../../utils/AuthService";
import { config } from "../../../config";
import ContentActions from "../../container/content-actions-container/content-actions-container.component";
import ShareData from "../../others/sharing/share-component";
import { setSubjects, setAreas, setGuides, setGuide } from "../../../Redux/iGuide";
import { setClients } from "../../../Redux/iGuide";
import { setShowModal } from "../../../Redux/shareDataSlice";
import { archiveModalHeaders, columns, detailColumns, sharingDataColumns, sharingSources } from "./InterviewGuide.Objects";
import { entitiesListHeaderActions } from "./InterviewGuide.Objects";
import { getLatest, getBySubjectAndArea, deleteGuides, getDeletedGuides, getFilteredGuides } from "../../../API/guides/guide-apis.js";
import { getSubjects, getAreas } from "../../../API/guides/guide-apis.js";
import { getUniqueClients } from "../../../API/clients/clients-apis";
import { getFilteredCandidates } from "../../../API/candidates/candidate-apis";
import "./styles.css";
import { mapGuides } from "./guide_utils/utils";
import { TableComponent } from "../../common/table/Table";
import { PageContainer } from "../../container/page-container/PageContainer";
import TableDetails from "../../common/table/TableDetails";
import Archived from "../../common/archived/Archived";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";

const ViewInterviewGuide = () => {
  const dispatch = useDispatch();
  const [headers] = useState(auth.getHeaders());
  const history = useHistory();
  const { guides, subjects, clients } = useSelector((state) => state.iGuide);
  const [activeCandidates, setActiveCandidates] = useState([]);
  const [filters, setFilters] = useState({});
  const [pageSize, setPageSize] = useState(config.ITEMS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);
  const [openArchive, setOpenArchive] = useState(false);
  const [childData, setChildData] = useState({});
  const [detailSelectedRows, setDetailSelectedRows] = useState({});
  const [expandedRowKeys, setExpandedRowKeys] = useState([])
  const [sort, setSort] = useState({});
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);

const[isActive,setIsActive]=useState(true);
  const[isLogout,setLogout]=useState(false);
  const guidesList = useCallback((headers) => {
    unCheckGuides();
    getLatest(headers, filters)
      .then((res) => dispatch(setGuides(res.data?.length ? mapGuides(res.data) : [])))
      .catch((err) => console.log("Error fetching latest data:", err));
  }, [dispatch, filters]);

  useEffect(() => {
    guidesList(headers);
    getSubjects(headers)
      .then((res) => dispatch(setSubjects(res ? res : [])))
      .catch((err) => console.log(err));
    getAreas(headers)
      .then((res) => dispatch(setAreas(res ? res : [])))
      .catch((err) => console.log(err));
    getUniqueClients(headers)
      .then((res) => dispatch(setClients(res ? res : [])))
      .catch((err) => console.log(err));
  }, [headers, dispatch, guidesList]);

  useEffect(() => {
    if (!openArchive) guidesList(headers)
  }, [openArchive, guidesList, headers]);

  useEffect(() => {
    const page = 1, size = 100;
    const filter = { "status": "Active,Ready to be Marketed,Onboarded" };
    // getFilteredCandidates(headers, filter, page, size)
    const sortKey = Object.keys(sort)[0] ? Object.keys(sort)[0] : "";
    const sortOrder = sortKey ? sort[sortKey] : "";
    getFilteredCandidates(headers, filter, page, size,sortKey ? sortKey : "id",sortOrder ? sortOrder : "desc")
      .then(res => {
        if (res.tableData)
          setActiveCandidates(res.tableData.map(candidate => (
            { id: candidate.id, name: candidate.fullName, email: candidate.email, status: candidate.status }
          )));
      })
  }, [headers]);

  const getSharingGuides = async (params, page = 1, size = 10) => {
    try {
      let filter = {}
      if (params.name === "Subject") filter = { subject: params.selection.name };
      if (params.name === "Client") filter = { client: params.selection.name };
      return await getFilteredGuides(headers, filter, page, size);
    } catch (err) {
      console.log(err);
      return {};
    }
  };

  const toggleEditModal = (id) => {
    const flatArray = Object.values(childData).flat()
    const guide = flatArray.find((g) => +g.id === +id);
    dispatch(setGuide(guide));
    history.push(`/guides/${id}`);
  };

  const childColumns = detailColumns(toggleEditModal);

  const openForm = () => {
    dispatch(setGuide({}));
    history.push("/addguide");
  };

  const searchGuides = (value) => {
    setFilters({ ...filters, search: value });
  };

  const archiveGuides = () => {
    const archiveGuides = Object.values(detailSelectedRows).flat().map(guide => parseInt(guide));
    deleteGuides(headers, archiveGuides)
      .then(() => guidesList(headers))
      .finally(() => unCheckGuides());
  };

  const unCheckGuides = () => {
    setDetailSelectedRows({});
    setChildData({});
    setExpandedRowKeys([]);
  };

  const toggleShareModal = () => {
    dispatch(setShowModal(true));
  };

  const expandedRowRender = (row) => {
    if (!childData[row.id]) {
      getChildData(row);
      return;
    } else {
      return (
        <TableDetails
          id={row.id}
          columns={childColumns}
          data={childData[row.id]}
          selectedRows={detailSelectedRows}
          onSelectChange={setDetailSelectedRows}
        />
      );
    }
  };

  const getChildData = (row) => {
    getBySubjectAndArea(headers, row.subject.id, row.area.id, currentPage, pageSize, filters)
      .then(res => {
        if (res.data) {
          setChildData({ ...childData, [row.id]: res.data });
        };
        return (
          <TableDetails
            id={row.id}
            columns={childColumns}
            data={res.data}
            selectedRows={detailSelectedRows}
            onSelectChange={setDetailSelectedRows}
          />
        );
      })
      .catch(err => console.log(err));
  };

  const rowSelection = {
    selectedRowKeys: Object.values(detailSelectedRows).flat() || [],
    getCheckboxProps: (row) => ({ disabled: row.disableSelection, }),
  };

  return (
    <PageContainer>
         <IdleTimeOutHandler 
    onActive={()=>{setIsActive(true)}} 
    onIdle={()=>{setIsActive(false)}}
    onLogout={()=>{setLogout(true)}}
    />
    {isAdmin || roleData.workerPermission ?
      <ContentActions>
        {entitiesListHeaderActions({ openForm, toggleShareModal })}
      </ContentActions>:""}

      <TableComponent
        columns={columns(subjects)}
        data={guides.map((guide) => ({ ...guide, key: guide.id }))}
        expandedRowRender={expandedRowRender}
        scroll={{ x: "100%", y: "calc(100vh - 200px)" }}
        handleSearch={searchGuides}
        handleConfirmArchive={archiveGuides}
        handleCancelArchiving={unCheckGuides}
        openArchive={() => setOpenArchive(true)}
        rowSelection={isAdmin || roleData.workerPermission ? rowSelection :false}
        expandedRowKeys={expandedRowKeys}
        setExpandedRowKeys={setExpandedRowKeys}

        setPageSize={setPageSize}
        setCurrentPage={setCurrentPage}
        setFilters={setFilters}
        filters={filters}
      />

      <ShareData
        title="Interview Questions sharing"
        sources={sharingSources({ "Subject": subjects, "Clients": clients })}
        receivers={activeCandidates}
        getData={getSharingGuides}
        columns={sharingDataColumns}
        contentMapping={{ header: ["subject.name", "client.clientName"], body: ["questions"] }}
      />

      <Archived
        archivedData="guides"
        callback={getDeletedGuides}
        tabHeaders={archiveModalHeaders}
        openArchive={openArchive}
        setOpenArchive={setOpenArchive}
      />
    </PageContainer>
  );
};

export default ViewInterviewGuide;

