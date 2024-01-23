import { useState, useEffect } from "react";
import { BASE_URL } from "../../..";
import CustomTable from "../../../components/utils/customTable";
import axios from "axios";

function IdCardList() {
  const [repoAgents, setRepoAgents] = useState([]);
  const apiUrl = `${BASE_URL}/get-all-cards`;
  const token = localStorage.getItem("token");
  console.log({ repoAgents });
  useEffect(() => {
    const fetchData = async () => {
      try {
        axios
          .get(apiUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            const data = res.data;
            setRepoAgents(data);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiUrl]);

  const columns = [
    { Header: "Card ID", accessor: "cardId" },
    { Header: "Agent Name", accessor: "agentName" },
    { Header: "Father Name", accessor: "fatherName" },
    { Header: "Mobile", accessor: "mobile" },
    { Header: "Address Line 1", accessor: "addressLine1" },
    { Header: "Address Line 2", accessor: "addressLine2" },
    { Header: "Valid From", accessor: "validFrom" },
    { Header: "Valid To", accessor: "validTo" },
    { Header: "Status", accessor: "status" },
    {
      Header: "Photo",
      accessor: "photo",
      Cell: ({ cell: { value } }) => (
        <img src={value?.Url} alt="Photo" style={{ width: "50px" }} />
      ),
    },
    {
      Header: "Signature",
      accessor: "signature",
      Cell: ({ cell: { value } }) => (
        <img src={value?.Url} alt="Signature" style={{ width: "50px" }} />
      ),
    },
    {
      Header: "QR Code",
      accessor: "qrCode",
      Cell: ({ cell: { value } }) => (
        <img src={value} alt="QR Code" style={{ width: "50px" }} />
      ),
    },
    { Header: "Created At", accessor: "createdAt" },
    { Header: "Updated At", accessor: "updatedAt" },
  ];

  return (
    <div className="container bg-blue-400 text-white  mx-auto my-4">
      <h2 className="text-2xl font-bold mb-4">Id Card List</h2>
      <CustomTable columns={columns} data={repoAgents} searchEnabled={true} />
    </div>
  );
}

export default IdCardList;
