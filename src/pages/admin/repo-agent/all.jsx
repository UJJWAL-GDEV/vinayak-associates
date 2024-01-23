import { useState, useEffect } from "react";
import { BASE_URL } from "../../..";
import CustomTable from "../../../components/utils/customTable";

function RepoAgentList() {
  const [repoAgents, setRepoAgents] = useState([]);
  const apiUrl = `${BASE_URL}/get-all-repo-agents`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setRepoAgents(data.agents);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiUrl]);

  const columns = [
    // Define your table columns based on the data properties
    { Header: "Zone", accessor: "zoneId.name" },
    { Header: "State", accessor: "stateId.name" },
    { Header: "City", accessor: "cityId.name" },
    { Header: "Name", accessor: "name" },
    { Header: "Mobile 1", accessor: "mobile" },
    { Header: "Mobile 2", accessor: "alternativeMobile" },
    { Header: "Email", accessor: "email" },
    { Header: "Pan Card", accessor: "panCard" },
    { Header: "Aadhaar card", accessor: "aadharCard" },
    { Header: "Address", accessor: "addressLine1" },
    { Header: "State", accessor: "state" },
    { Header: "City", accessor: "city" },
    { Header: "Pin Code", accessor: "pincode" },
    { Header: "Username", accessor: "username" },
    { Header: "Status", accessor: "status" },
    // Add more columns as needed
  ];

  return (
    <div className="container bg-gray-600 text-white  my-4">
      <h2 className="text-2xl font-bold mb-4">Repo Agents List</h2>
      <CustomTable
        columns={columns}
        data={repoAgents}
        searchEnabled={true}
        filterEnabled={true}
      />
    </div>
  );
}

export default RepoAgentList;
