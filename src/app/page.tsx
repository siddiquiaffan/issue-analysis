import IssueAnalysis from "./IssueAnalysis"

export const metadata = {
  title: "GitHub Issues Dashboard",
  description: "Analyze GitHub repository issues with ease.",
}

const Home = () => {
  return (
    <>
      <IssueAnalysis />
    </>
  )
}

export default Home