import React from "react";
import axios from "axios";
import { render, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateClient from "../CreateClient";

jest.mock("axios");
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

describe("create client as admin", () => {
   beforeEach(async () => {
     sessionStorage.setItem("userInfo", JSON.stringify(adminInfo));
   });

   it("renders", () => {
      render(<CreateClient />);
   });

   it("matches snapshot DOM node structure", () => {
     const comp = render(<CreateClient />);

     expect(comp.asFragment()).toMatchSnapshot();
   });

   it("contains correct elements", () => {
      const comp = render(<CreateClient/>);

      const heading = comp.getByRole("heading");
      const inputs = comp.getAllByRole("textbox");
      const buttons = comp.getAllByRole("button");

      expect(heading).toHaveTextContent("Create Client");
      expect(inputs).toHaveLength(8);
      expect(comp.getByRole("textbox", {name: "Client Name *"})).toHaveValue("");
      expect(comp.getByRole("textbox", {name: "Phone #"})).toHaveValue("");
      expect(comp.getByRole("textbox", {name: "Address Line 1"})).toHaveValue("");
      expect(comp.getByRole("textbox", {name: "Address Line 2"})).toHaveValue("");
      expect(comp.getByRole("textbox", {name: "City"})).toHaveValue("");
      expect(comp.getByRole("textbox", {name: "State / Province"})).toHaveValue("");
      expect(comp.getByRole("textbox", {name: "Country"})).toHaveValue("");
      expect(comp.getByRole("textbox", {name: "ZIP Code"})).toHaveValue("");
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveValue("Submit");
      expect(buttons[1]).toHaveValue("Reset");
   });

   it("reset btn clears form", () => {
      const comp = render(<CreateClient />);

      const clientName = comp.getByRole("textbox", {name: "Client Name *"});
      const phone = comp.getByRole("textbox", {name: "Phone #"});
      const add1 = comp.getByRole("textbox", {name: "Address Line 1"});
      // const add2 = comp.getByRole("textbox", {name: "Address Line 2"});
      // const city = comp.getByRole("textbox", {name: "City"});
      // const state = comp.getByRole("textbox", {name: "State / Province"});
      // const country = comp.getByRole("textbox", {name: "Country"});
      // const zip = comp.getByRole("textbox", {name: "ZIP Code"});
      const reset = comp.getByRole("button", {name: "Reset"});

      userEvent.type(clientName, "Gap");
      // userEvent.type(phone, 1234567890);
      userEvent.type(add1, "A Street");

      expect(clientName).toHaveValue("Gap");
      // expect(phone).toHaveValue("+1(123) 456-7890");
      expect(add1).toHaveValue("A Street");

      userEvent.click(reset);
      expect(clientName).toHaveValue("");
      // expect(phone).toHaveValue("");
      expect(add1).toHaveValue("");
      
   })
})