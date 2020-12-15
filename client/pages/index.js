import buildClient from "../api/build-client";

const Home = () => {
  return <h1>Hello</h1>;
};

Home.getInitialProps = async (context) => {
  const axiosClient = buildClient(context);
  const { data } = await axiosClient.get("/api/users/currentuser");

  return data;
};

export default Home;
