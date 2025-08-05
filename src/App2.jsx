const App2 = ({ fullName, onLogout, children }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [correspondenceData, setCorrespondenceData] = useState([]);

  // Fetch correspondence when dashboard tab is active
  useEffect(() => {
    if (activeTab === "dashboard") {
      const fetchCorrespondence = async () => {
        const { data, error } = await supabase
          .from("correspondence")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) console.error("Error fetching correspondence:", error);
        else setCorrespondenceData(data || []);
      };

      fetchCorrespondence();
    }
  }, [activeTab]);

  return (
    <div className="main2">
      <Navbar onTabChange={setActiveTab} onLogout={onLogout} />
      <div className="main">
        <div className="top-content">
          <h1>Correspondence System</h1>
          <h2>{fullName}</h2>
        </div>

        {/* ✅ Render children passed from MainApp */}
        {children}
      </div>
    </div>
  );
};

export default App2;
