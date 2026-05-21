import type { Metadata } from "next";
import { Stack } from "@mui/material";
import LandingPage from "@page-components/Website/LandingPage/LandingPage";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "";

export const metadata: Metadata = {
  title: `${APP_NAME}`,
};

const Page = () => {
  return <LandingPage />;
};

export default Page;
