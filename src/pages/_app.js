import { createGlobalStyle } from "styled-components";
import Head from "next/head";
import { BackButton } from "@/components/BackButton";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #111827;
    color: #e5e7eb;
  }

  * {
    box-sizing: border-box;
  }

  .react-datepicker {
    font-family: inherit;
    font-size: 0.8rem;
    background-color: #1f2937;
    color: #d1d5db;
    border: 1px solid #4b5563;
    border-radius: 0.5rem;
  }
  .react-datepicker__header {
    background-color: #374151;
    border-bottom: 1px solid #4b5563;
  }
  .react-datepicker__current-month,
  .react-datepicker-time__header,
  .react-datepicker-year-header {
    color: #f9fafb;
  }
  .react-datepicker__day-name,
  .react-datepicker__day,
  .react-datepicker__time-name {
    color: #d1d5db;
  }
  .react-datepicker__day:hover,
  .react-datepicker__month-text:hover,
  .react-datepicker__quarter-text:hover,
  .react-datepicker__year-text:hover {
    background-color: #4b5563;
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range {
    background-color: #2563eb;
    color: #fff;
  }
  .react-datepicker__day--keyboard-selected {
    background-color: #1d4ed8;
    color: #fff;
  }
  .react-datepicker__navigation-icon::before {
    border-color: #d1d5db;
  }
  .react-datepicker__triangle::before,
  .react-datepicker__triangle::after {
    border-bottom-color: #1f2937 !important;
  }
`;

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Nexus Maximus</title>
        <meta
          name="description"
          content="Személyes menedzsment alkalmazás"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <GlobalStyle />
      <BackButton />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;