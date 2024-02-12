import Button from "../../common/button/button.component";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component";
import ActionBtns from "../../container/action-btns-container/action-btns-container";
import { ExportOutlined } from "@ant-design/icons";
import { EditFilled,PlusOutlined, ShareAltOutlined } from "@ant-design/icons";
import { getFullName } from "../../../utils/service";
import { TableLink } from "../../common/table/TableLink";
import { PageHeader } from "../../container/page-header/PageHeader";
import { Workbench } from "../../container/workbench-container/Workbench";

export const archiveModalHeaders = ["Subject", "Area", "Client"];

export const entitiesListHeaderActions = (object) => {
  const { openForm, toggleShareModal } = object;

  return (
    <div className="page-actions-container">
      <h1 className="page-header">Interview Questions Guide</h1>
      <div className="flex-row">
        <Button
          type="button"
          className="btn main margin-right"
          handleClick={openForm}
        >
          <PlusOutlined style={{ fontSize: "12px", marginRight: "5px" }} />
          Add Questions
        </Button>
        <ActionBtns
          btns={[
            {
              handleClick: toggleShareModal,
              title: "Share",
              child: <ShareAltOutlined />,
            },
            {
              handleClick: () => console.log("click report"),
              title: "Export report",
              child: <ExportOutlined />,
              disabled: true,
            },
          ]}
        />
      </div>
    </div>
  );
};

export const entityHeaderActions = (object) => {
  const { closeForm, guide } = object;
  return (
    <Breadcrumbs
      className="header"
      crumbs={[
        {
          id: 0,
          text: "Interview Question Guide",
          onClick: () => closeForm(),
        },
        {
          id: 1,
          text: "Add New Quide",
          lastCrumb: true,
        },
      ]}
    />
  );
};

const titleStyles = {
  fontWeight: "600",
  fontSize: "12px",
  textTransform: "uppercase",
};

export const columns = (subjects) => [
  {
    title: <div style={titleStyles}>Subject</div>,
    dataIndex: "subject",
    key: "subject",
    render: (_, row) => row.subject.name,
    filters: subjects?.map((subject) => ({
      text: subject.name,
      value: subject.name,
    })),
    filterSearch: true,
  },
  {
    title: <div style={titleStyles}>Area of focus</div>,
    dataIndex: "area",
    key: "area",
    render: (_, row) => row.area.name,
  },
  {
    title: <div style={titleStyles}>Modified by</div>,
    dataIndex: "user",
    key: "user",
    width: 150,
    render: (_, row) => getFullName(row.user),
  },
  {
    title: <div style={titleStyles}>Modified on</div>,
    dataIndex: "date",
    key: "date",
    width: 120,
    render: (_, row) =>{
      var dateParts = row.updatedAt.split("/")||row.createdAt.split("/");
      var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 
      return dateObject.toLocaleDateString();
    }
     
  },
];

export const detailColumns = (onEdit = null) => {
  return [
    {
      title: <div style={titleStyles}>Subject</div>,
      dataIndex: "subject",
      render: (value, row) => (
        <TableLink
          label={value.name}
          onClick={() => (onEdit ? onEdit(row.id) : {})}
        />
      ),
    },
    {
      title: <div style={titleStyles}>Area of focus</div>,
      dataIndex: "area",
      render: (value) => value.name,
    },
    {
      title: <div style={titleStyles}>Client</div>,
      dataIndex: "client",
      render: (value) => value?.clientName,
    },
    {
      title: <div style={titleStyles}>Modified by</div>,
      dataIndex: "user",
      render: (value) => getFullName(value),
      width: 150,
    },
    {
      title: <div style={titleStyles}>Modified on</div>,
      dataIndex: "modifiedOn",
      key: "date",
      render: (_, row) =>
        new Date(row.updatedAt || row.createdAt).toLocaleDateString(),
      width: 120,
    },
  ];
};

export const sharingDataColumns = [
  {
    title: "Subject",
    dataIndex: "subject",
    render: (value) => <div>{value.name}</div>,
  },
  {
    title: "Area of focus",
    dataIndex: "area",
    render: (value) => <div>{value.name}</div>,
  },
  {
    title: "Client",
    dataIndex: "client",
    render: (value) => <div>{value.clientName}</div>,
  },
  {
    title: "Questions",
    dataIndex: "questions",
    render: (value) => {
      if (value && value.length > 35)
        return <span title={value}>{value.slice(0, 35) + "..."}</span>;
      return value;
    },
    width: 280,
  },
  {
    title: <div>Modified on</div>,
    dataIndex: "modifiedOn",
    key: "date",
    render: (_, row) =>
      new Date(row.updatedAt || row.createdAt).toLocaleDateString(),
    width: 105,
  },
];

export const sharingSources = (options) => [
  {
    id: 1,
    name: "Subject",
    options: options["Subject"].map((subject) => ({
      id: subject.id,
      name: subject.name,
    })),
  },
  {
    id: 2,
    name: "Client",
    options: options["Clients"].map((client) => ({
      id: client.id,
      name: client.clientName,
    })),
  },

  
];
export const editentityHeaderActions = (object) => {
  const { closeForm, auth ,toggleForm,handleSubmit,editEnabled} = object;
  return (
    
    <PageHeader
        breadcrumbs={
          <Breadcrumbs
            className="header"
            crumbs={[
              {
                id: 0,
                text: "Interview Question Guide",
                onClick: () => closeForm(),
              },             {
                id: 1,
                text: "Edit Quide",
                lastCrumb: true,
              },
            ]}
          />
        }
        actions={
          <>
            {editEnabled && (
              <>
                <Button
                  type="button"
                  handleClick={handleSubmit}
                  className={"btn main submit marginX"}
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  handleClick={closeForm}
                  className={"btn main reset marginX"}
                >
                  Cancel
                </Button>
              </>
            )}
            <Workbench>
                <Button
                  type="button"
                  handleClick={toggleForm}
                  className="btn icon marginX"
                  title="Edit"
                >
                  <EditFilled />
                </Button>
              
             
            </Workbench>
          </>
        }
      />
  );
};