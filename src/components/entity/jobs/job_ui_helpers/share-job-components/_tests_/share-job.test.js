import React from "react";
import { render, cleanup, act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShareJobs } from '../share-job-modal';

afterEach(cleanup);


describe("share job modal", () => {
   it("renders", () => {
      render(<ShareJobs open={true}/>)
   });

   it("matches snapshot DOM structure", () => {
     const { asFragment } = render(<ShareJobs open={true} />);
     expect(asFragment()).toMatchSnapshot();
   });

   it("initial render with expected components", () => {
      const comp = render(<ShareJobs/>);

      // const selects = comp.getAllByRole("select");
      // const title = screen.getByText("Share Job Openings")
   })
})