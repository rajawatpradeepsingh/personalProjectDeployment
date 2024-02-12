import { useSelector, useDispatch } from "react-redux";
import { PageContainer } from "../../container/page-container/PageContainer";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import { useState, useCallback, useEffect } from "react";
import { PageHeader } from "../../container/page-header/PageHeader";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component";
import { useHistory, useParams } from "react-router-dom";
import AuthService from "../../../utils/AuthService";
import { setIsAuth } from "../../../Redux/appSlice";
import Content from "../../container/content-container/content-container.component";
import { config } from "../../../config";
import axios from "axios";
import ExpandableTable from "../../ui/expandable-table/expandable-table.component";
import "../commissionType/commissionType.scss";
const ViewDetailCommission = () => {
    const [isActive, setIsActive] = useState(true)
    const [isLogout, setLogout] = useState(false)
    const history = useHistory();
    const [headers] = useState(AuthService.getHeaders());
    const dispatch = useDispatch();
    const params = useParams();
    const [detailsCommissionList, setDetailsCommissionList] = useState([]);
    const ITEMS_PER_PAGE = config.ITEMS_PER_PAGE;
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const logout = useCallback(() => {
        dispatch(setIsAuth(false));
        AuthService.logout();
    }, [dispatch]);


    const getDetailCommission = useCallback(async () => {
        try {
            const id = params?.commId;
            const response = await axios
                // .get(`${config.serverURL}/commission/commissionPage?id=${id}&pageNo=${currentPage - 1}&pageSize=10`, { headers });
                .get(`${config.serverURL}/commission/${id}`, { headers });

            if (response.status === 200) {
                const newRecords = response.data;
                // const newRecords = res.map(dc => {
                //     return {
                //         workerName: `${dc?.timeSheets?.[0]?.worker?.firstName} ${dc?.timeSheets?.[0]?.worker?.lastName}` ,
                //         billHours: `${dc?.timeSheets?.[0]?.billableHours}`,
                //         endDate: `${dc?.timeSheets?.[0]?.timesheetWeekDays?.sundayDate}`,
                //         Commission: `${Number(dc?.timeSheets?.[0]?.commissionPerWeek).toFixed(2)}`
                //     }
                // })
                setDetailsCommissionList(newRecords);
                console.log(newRecords);
                setTotalItems(newRecords.length);
                console.log(newRecords.length);
            };
        } catch (error) {
            console.log(error);
        };
    }, [headers, currentPage, ITEMS_PER_PAGE]);


    useEffect(() => {
        getDetailCommission();
    }, [getDetailCommission]);

  
    const changeTablePage = (page) => {
        setCurrentPage(page);
    };

    const closeForm = () => {
        history.push("/viewcommission");
    };

    return (
        <PageContainer>
            <IdleTimeOutHandler
                onActive={() => { setIsActive(true) }}
                onIdle={() => { setIsActive(false) }}
                onLogout={() => { setLogout(true) }}
            />
            <PageHeader
                breadcrumbs={
                    <Breadcrumbs
                        className="header"
                        crumbs={[
                            { id: 0, text: "Commission", onClick: () => closeForm() },
                            { id: 1, text: "Detail Commission", lastCrumb: true },
                        ]}
                    />

                }
            />
            <Content>

                <div style={{ width: "100%" }}>
                    <h3 className="disabled-form-section-header">Commission Details</h3>

                    <ExpandableTable
                        headers={[
                            { id: 1, label: "Worker Name" },
                            { id: 2, label: "Week End Date" },
                            { id: 3, label: "Hours Logged" },
                            { id: 4, label: "Commission" },
                        ]}
                       body={detailsCommissionList?.timeSheets?.length > 0 ? detailsCommissionList.timeSheets.map(ts => (
                            {
                                cells: [
                                    { id: 1, data: `${ts.worker.firstName + " " + ts.worker.lastName}` },
                                    { id: 2, data: ts.timesheetWeekDays.sundayDate },
                                    { id: 3, data: ts.billableHours,className:"align1"},
                                    { id: 4, data: ts.commissionPerWeek,className:"align1"},
                                ]
                            }
                        )) : []}
                    />

                </div>
            </Content>

        </PageContainer>


    )
}
export default ViewDetailCommission;
