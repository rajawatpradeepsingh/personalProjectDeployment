import { useState, useEffect } from 'react';
import { Table } from "antd";
import { FileTextFilled } from '@ant-design/icons';
import './cand-subcomp.scss';

export const CandidateExpandedRow = (props) => {
  const [data, setData] = useState([]);

  const handleClick = () => props.viewResume();

  useEffect(() => {
    if (props.data.length) {
      setData([{
        submissions: props.data[0].submissions,
        rejections: props.data[0].rejections,
        onboardings: props.data[0].onboardings,
        comment: props.data[1],
        resume: props.data[2].resume,
        source: props.data[2].source,
        id: props.data[2].id,
      }])
    }
  }, [props.data]);

  const columns = [
    {
      title: "Resume",
      dataIndex: "resume",
      render: (resume) =>
        resume ? (
          <span
            onClick={handleClick}
            style={{
              fontSize: "24px",
              color: "var(--secondary)",
              cursor: "pointer",
            }}
          >
            <FileTextFilled />
          </span>
        ) : null,
      key: "resume",
      width: 70,
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
    },
    {
      title: "Submissions",
      dataIndex: "submissions",
      render: (submissions) => (
        <span
          style={{
            color: "var(--secondary)",
            fontWeight: 600,
            fontSize: "16px",
          }}
        >
          {submissions}
        </span>
      ),
      key: "submissions",
    },
    {
      title: "Onboardings",
      dataIndex: "onboardings",
      render: (onboardings) => (
        <span
          style={{
            color: "var(--success)",
            fontWeight: 600,
            fontSize: "16px",
          }}
        >
          {onboardings}
        </span>
      ),
      key: "onboardings",
    },
    {
      title: "Rejections",
      dataIndex: "rejections",
      key: "rejections",
      render: (rejections) => (
        <span
          style={{
            color: "var(--error)",
            fontWeight: 600,
            fontSize: "16px",
          }}
        >
          {rejections}
        </span>
      ),
    },
    {
      title: "Latest Comment",
      dataIndex: "comment",
      key: "comment",
      //  ellipsis: true,
    },
    {
      title: "Update",
      dataIndex: "id",
      key: "id",
      fixed: "right",
      render: (id) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            className="updt-btns"
            style={{ marginBottom: "5px" }}
            onClick={() => props.getCandidate(id, "open-comments")}
          >
            comment
          </span>
          <span
            className="updt-btns"
            onClick={() => props.getCandidate(id, "open-activity")}
          >
            activity
          </span>
        </div>
      ),
    },
  ];

  return (
    <Table dataSource={data} columns={columns} pagination={false} rowKey={() => `${data?.id}_expanded`} />
  )
}