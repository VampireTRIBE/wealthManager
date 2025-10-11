function Home({ name, ...props }) {
  const navigate = useNavigate();
  return (
    <main className={postLoginStyle.main}>
      <H1 className={headingStyle.title} text={`Hi... ${name}`} />
      <H1 className={headingStyle.title} text={`Welcome to Wealth Manager`} />
    </main>
  );
}

export default Home;