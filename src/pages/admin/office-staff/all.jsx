import { useState, useEffect } from "react";
import { BASE_URL } from "../../..";
import CustomTable from "../../../components/utils/customTable";
import axios from "axios";

function OfficeStaffList() {
  const [repoAgents, setRepoAgents] = useState([]);
  const apiUrl = `${BASE_URL}/get-staf`;
  const token = localStorage.getItem("token");
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
            setRepoAgents(data.stafs);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiUrl]);

  const columns = [
    { Header: "ID", accessor: "_id" },
    { Header: "Staff ID", accessor: "stafId" },
    { Header: "Name", accessor: "name" },
    { Header: "Username", accessor: "username" },
    { Header: "Email", accessor: "email" },
    { Header: "Mobile", accessor: "mobile" },
    { Header: "Alternative Mobile", accessor: "alternativeMobile" },
    { Header: "Address Line 1", accessor: "addressLine1" },
    { Header: "Address Line 2", accessor: "addressLine2" },
    { Header: "City", accessor: "city" },
    { Header: "State", accessor: "state" },
    { Header: "Pincode", accessor: "pincode" },
    {
      Header: "Aadhar Card",
      accessor: "aadharCard",
      // Cell: ({ cell: { value } }) => <img src={value} alt="Photo" style={{ width: '50px' }} />
    },
    { Header: "PAN Card", accessor: "panCard" },
    {
      Header: "PAN Card (Image)",
      accessor: "pancard.Url",
      Cell: ({ cell: { value } }) => (
        <img src={value} alt="Photo" style={{ width: "50px" }} />
      ),
    },
    {
      Header: "Photo",
      accessor: "photo.Url",
      Cell: ({ cell: { value } }) => (
        <img src={value} alt="Photo" style={{ width: "50px" }} />
      ),
    },
    {
      Header: "Signature",
      accessor: "signature.Url",
      Cell: ({ cell: { value } }) => (
        <img src={value} alt="Photo" style={{ width: "50px" }} />
      ),
    },
    {
      Header: "Licence",
      accessor: "licence.Url",
      Cell: ({ cell: { value } }) => (
        <img src={value} alt="Photo" style={{ width: "50px" }} />
      ),
    },
    {
      Header: "Cheque.Url",
      accessor: "cheque",
      Cell: ({ cell: { value } }) => (
        <img src={value} alt="Photo" style={{ width: "50px" }} />
      ),
    },
    { Header: "Device ID", accessor: "deviceId" },
    { Header: "Status", accessor: "status" },
    { Header: "Token Version", accessor: "tokenVersion" },
    { Header: "Created At", accessor: "createdAt" },
    { Header: "Updated At", accessor: "updatedAt" },
  ];

  return (
    <div className="container bg-blue-400 text-white  mx-auto my-4">
      <h2 className="text-2xl font-bold mb-4">Office Staff List</h2>
      <CustomTable columns={columns} data={repoAgents} searchEnabled={true} />
    </div>
  );
}

export default OfficeStaffList;
