import React from "react";
import axios from "axios";
import { ViewInterviewers } from "../ViewInterviewers";
import { render, cleanup, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("axios");
const mockShowModal = jest.fn();
const mockSetShowModal = jest.fn();
const mockEditInterviewer = jest.fn();

afterEach(cleanup);
afterEach(() => jest.resetAllMocks());
beforeEach(() => {
  sessionStorage.clear();
});

const adminInfo = {
  name: "user",
  pass: "newpass",
  firstName: "Test",
  lastName: "User",
  email: "xample@example.com",
  roles: [{ id: 1, roleName: "ADMIN" }],
};

const userNotAuth = {
  name: "user",
  pass: "newpass",
  firstName: "Test",
  lastName: "User",
  email: "xample@example.com",
  roles: [{ id: 1, roleName: "HR" }],
};

const data = {
  data: [
    {
      id: 1,
      full_name: "John Doe",
      location: "USA",
      phone_no: "+1(000) 000-0000",
      email: "test@test.com",
      interview_skills: "testing",
      current_project: "gap",
      total_experience: 3,
    },
    {
      id: 2,
      full_name: "Jane Doe",
      location: "OAK",
      phone_no: "+1(000) 222-2222",
      email: "test2@test.com",
      interview_skills: "technical",
      current_project: "rcp",
      total_experience: 10,
    },
  ],
};

describe("axios.get interviewers is successful", () => {
  it("renders component", async () => {
    let rendered;
    sessionStorage.setItem("userInfo", JSON.stringify(adminInfo));

    await act(async () => {
      await axios.get.mockResolvedValueOnce({
        URL: "http://localhost:9093/interviewer?pageNo=0&pageSize=10",
      });
      await axios.get.mockResolvedValueOnce(data);
      rendered = render(<ViewInterviewers />);
    });

    const heading = rendered.getByRole("heading");
    const table = rendered.getByRole("table");
    const thead = rendered.getAllByRole("columnheader");
    const trow = rendered.getAllByRole("row");
    const btns = rendered.getAllByRole("button");
    const editBtn = rendered.getAllByTestId("edit-btn");
    const checkboxes = rendered.getAllByRole("checkbox");

    expect(heading).toHaveTextContent("Interviewers");
    expect(table).toHaveProperty("className", "interviewerTable");
    expect(thead).toHaveLength(9);
    expect(trow).toHaveLength(3);
    expect(btns).toHaveLength(3);
    expect(editBtn).toHaveLength(2);
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(btns[0]).toBeDisabled();
  });

  it("renders comp with edit/delete btns disabled for non admin/recruiters", async () => {
    let rendered;
    sessionStorage.setItem("userInfo", JSON.stringify(userNotAuth));
    await act(async () => {
      await axios.get.mockResolvedValueOnce({
        URL: "http://localhost:9093/interviewer?pageNo=0&pageSize=10",
      });
      await axios.get.mockResolvedValueOnce(data);
      rendered = render(<ViewInterviewers />);
    });

    const editBtn = rendered.getAllByTestId("edit-btn");
    const checkboxes = rendered.getAllByRole("checkbox");

    expect(editBtn).toBeDisabled;
    expect(checkboxes).toBeDisabled;
  });

  it("matches snapshot DOM node structure", async () => {
    let rendered;
    sessionStorage.setItem("userInfo", JSON.stringify(adminInfo));

    await act(async () => {
      await axios.get.mockResolvedValueOnce({
        URL: "http://localhost:9093/interviewer?pageNo=0&pageSize=10",
      });
      await axios.get.mockResolvedValueOnce(data);
      rendered = render(<ViewInterviewers />);
    });

    expect(rendered.asFragment()).toMatchSnapshot();
  });

  it("has correct table headers", async () => {
    let rendered;
    sessionStorage.setItem("userInfo", JSON.stringify(adminInfo));

    await act(async () => {
      await axios.get.mockResolvedValueOnce({
        URL: "http://localhost:9093/interviewer?pageNo=0&pageSize=10",
      });
      await axios.get.mockResolvedValueOnce(data);
      rendered = render(<ViewInterviewers />);
    });

    const thead = rendered.getAllByRole("columnheader");
    const trashIcon = rendered.getByTestId("trash-icon");

    expect(thead[0]).toContainElement(trashIcon);
    expect(thead[1]).toHaveTextContent("Edit");
    expect(thead[2]).toHaveTextContent("Name");
    expect(thead[3]).toHaveTextContent("Email");
    expect(thead[4]).toHaveTextContent("Contact #");
    expect(thead[5]).toHaveTextContent("Location");
    expect(thead[6]).toHaveTextContent("Interview Skills");
    expect(thead[7]).toHaveTextContent("Experience");
    expect(thead[8]).toHaveTextContent("Current Project");
  });

  it("data populates in correct fields", async () => {
    let rendered;
    sessionStorage.setItem("userInfo", JSON.stringify(adminInfo));

    await act(async () => {
      await axios.get.mockResolvedValueOnce({
        URL: "http://localhost:9093/interviewer?pageNo=0&pageSize=10",
      });
      await axios.get.mockResolvedValueOnce(data);
      rendered = render(<ViewInterviewers />);
    });

    const trow = rendered.getAllByRole("row");
    const cells = rendered.getAllByRole("cell");

    expect(trow[1]).toHaveTextContent("John Doe");
    expect(trow[1]).toHaveTextContent("+1(000) 000-0000");
    expect(trow[1]).toHaveTextContent("test@test.com");
    expect(trow[1]).toHaveTextContent("testing");
    expect(trow[1]).toHaveTextContent("gap");
    expect(trow[1]).toHaveTextContent(3);

    expect(trow[2]).toHaveTextContent("Jane Doe");
    expect(trow[2]).toHaveTextContent("+1(000) 222-2222");
    expect(trow[2]).toHaveTextContent("test2@test.com");
    expect(trow[2]).toHaveTextContent("technical");
    expect(trow[2]).toHaveTextContent("rcp");
    expect(trow[2]).toHaveTextContent(10);
  });

  it("clicking checkbox enables delete button", async () => {
    let rendered;
    sessionStorage.setItem("userInfo", JSON.stringify(adminInfo));

    await act(async () => {
      await axios.get.mockResolvedValueOnce({
        URL: "http://localhost:9093/interviewer?pageNo=0&pageSize=10",
      });
      await axios.get.mockResolvedValueOnce(data);
      rendered = render(<ViewInterviewers />);
    });

    const deleteBtn = rendered.getByTestId("int-delete");
    const checkboxes = rendered.getAllByRole("checkbox");

    userEvent.click(checkboxes[0]);

    expect(deleteBtn).toBeEnabled();
  });

  it("clicking edit button opens modal", async () => {
    let rendered;
    sessionStorage.setItem("userInfo", JSON.stringify(adminInfo));

    const selectedInterviewer = {
      id: 1,
      full_name: "John Doe",
      location: "USA",
      phone_no: "+1(000) 000-0000",
      email: "test@test.com",
      interview_skills: "testing",
      current_project: "gap",
      total_experience: 3,
    };

    await act(async () => {
      await axios.get.mockResolvedValueOnce({
        URL: "http://localhost:9093/interviewer?pageNo=0&pageSize=10",
      });
      await axios.get.mockResolvedValueOnce(data);
      rendered = render(<ViewInterviewers />);
    });

    const header = rendered.getAllByRole("heading");
    expect(header).toHaveLength(2);
    expect(header[1]).toHaveTextContent("Edit Interviewer");
  });
});

describe("axios.get interviewers fails", () => {
  it("loads empty table", async () => {
    let rendered;
    sessionStorage.setItem("userInfo", JSON.stringify(adminInfo));

    await act(async () => {
      await axios.get.mockResolvedValueOnce({
        URL: "http://localhost:9093/interviewer?pageNo=0&pageSize=10",
      });
      await axios.get.mockResolvedValueOnce([]);
      rendered = render(<ViewInterviewers />);
    });

    const thead = rendered.getAllByRole("columnheader");
    const trow = rendered.getAllByRole("row");
    const editBtn = screen.queryByRole("button", { name: "+" });
    const checkboxes = screen.queryByRole("checkbox");

    expect(thead).toHaveLength(9);
    expect(trow).toHaveLength(1);
    expect(editBtn).not.toBeInTheDocument();
    expect(checkboxes).not.toBeInTheDocument();
  });
});
