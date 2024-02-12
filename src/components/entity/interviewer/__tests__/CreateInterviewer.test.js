// import React from "react";
// import axios from "axios";
// import { render, cleanup, screen, act } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { CreateInterviewer } from "../CreateInterviewer";
// import  Modal  from "../../Modal";

// jest.mock("axios");
// afterEach(cleanup);
// afterEach(() => jest.resetAllMocks());
// const mockShowModal = jest.fn();
// describe('create interviewer component', () => {

//    //component renders
//    it('renders component', () => {
//       const comp = render(<CreateInterviewer/>);

//       const heading = comp.getByRole("heading");
//       const formInputs = comp.getAllByRole("textbox");
//       const submitBtn = comp.getByTestId("submit-btn");
//       const resetBtn = comp.getByTestId("reset-btn");
//       const closedModalText = screen.queryByText(/interviewer saved successfully!/i);

//       expect(heading).toHaveTextContent("Create Interviewer");
//       expect(formInputs).toHaveLength(9);
//       expect(submitBtn).toBeEnabled();
//       expect(resetBtn).toBeEnabled();
//       expect(closedModalText).not.toBeInTheDocument();
//    });

//    // matches snapshot--update as needed
//    it('matches snapshot DOM node structure', () => {
//       const { asFragment } = render(<CreateInterviewer/>);
//       expect(asFragment()).toMatchSnapshot();
//    });
   
//    //test form initial state
//    it('form loads, fields are empty', () => {
//       const { getByRole, getAllByRole } = render(<CreateInterviewer />);

//       expect(getAllByRole("textbox")).toHaveLength(9);
//       expect(getByRole("textbox", { name: "Last Name *" })).toHaveValue("");
//       expect(getByRole("textbox", { name: "Contact #" })).toHaveValue("");
//       expect(getByRole("textbox", { name: "E-mail *" })).toHaveValue("");
//       expect(getByRole("spinbutton", { name: "Total Experience (in years)" })).toHaveValue(null);
//       expect(getByRole("textbox", { name: "Current Project" })).toHaveValue("");
//       expect(getByRole("textbox", { name: "Interview Skills" })).toHaveValue("");

//    });

//    it('reset button clears form', () => {
//       const { getByRole, getByTestId } = render(<CreateInterviewer />);

//       userEvent.type(getByRole("textbox", {name: "First Name *"}), "Cecilia");
//       userEvent.type(getByRole("textbox", { name: "Last Name *" }), "Rossi");
//       userEvent.type(getByRole("textbox", {name: "Contact #"}), "5102929999");
//       userEvent.type(getByRole("textbox", {name: "E-mail *"}), "test@test.com");
//       userEvent.type(getByRole("spinbutton", {name: "Total Experience (in years)"}), "10");
//       userEvent.type(getByRole("textbox", {name:"Current Project"}), "rcp");
//       userEvent.type(getByRole("textbox", {name:"Interview Skills"}), "test");

//       userEvent.click(getByTestId("reset-btn"));

//       expect(getByRole("textbox", { name: "First Name *" })).toHaveValue("");
//       expect(getByRole("textbox", { name: "Last Name *" })).toHaveValue("");
//       expect(getByRole("textbox", { name: "Contact #" })).toHaveValue("");
//       expect(getByRole("textbox", { name: "E-mail *" })).toHaveValue("");
//       expect(getByRole("spinbutton", {name: "Total Experience (in years)"})).toHaveValue(null);
//       expect(getByRole("textbox", { name: "Current Project" })).toHaveValue("");
//       expect(getByRole("textbox", {name:"Interview Skills"})).toHaveValue("");
      
//    });

//    it("trying to submit without input shows error message", () => {
//       const comp = render(<CreateInterviewer />);

//       const noError = screen.queryByText(/please fill out all required fields/i);
//       expect(noError).not.toBeInTheDocument();

//       userEvent.click(comp.getByTestId("submit-btn"));

//       const errorMessage = comp.getByText(/please fill out all required fields/i);
//       expect(errorMessage).toBeInTheDocument();
//    });

//    it("shows model on successful post", async () => {
//       let modal;
//       const comp = render(<CreateInterviewer />);
//       expect(comp.queryByText(/ok/i)).not.toBeInTheDocument();

//       await act(async() => {
//          await axios.post.mockResolvedValueOnce({status: 201});
//          userEvent.click(comp.getByTestId("submit-btn"));
//          modal = render(<Modal showModal={mockShowModal}></Modal>)
//       })

//       expect(comp.getByText(/ok/i)).toBeInTheDocument();


//    })

// });



