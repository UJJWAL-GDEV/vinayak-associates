import { Button, Modal, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../..";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setError, setMessage } from "../../../../redux/user/userSlice";

export const ToggleStatus = ({ id, status, getData }) => {
  const [statusVal, setStatusVal] = useState(null);
  const [isSelectDisabled, setIsSelectDisabled] = useState(false);
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const handleStatusChange = (e) => {
    setIsSelectDisabled(true);
    setStatusVal(e.target.value);
    axios
      .put(
        `${BASE_URL}/change-vehicle-status/${id}`,
        { status: e.target.value, _id: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        dispatch(setMessage(`Status updated successfully`));
      })
      .then(() => {
        getData();
        setIsSelectDisabled(false);
        setModal(false);
      })
      .catch((e) => {
        dispatch(
          setError(
            e?.response?.data?.message || `Can't update status please retry`
          )
        );
        setIsSelectDisabled(false);
        setStatusVal(status);
      });
  };

  useEffect(() => {
    setStatusVal(status);
  }, []);

  return (
    <>
      <Button
        onClick={() => setModal(true)}
        colorScheme="blue"
        variant="outline"
        borderRadius="3px"
        ml={2}
        size="xs"
      >
        Change
      </Button>
      <Modal show={modal} onClose={() => setModal(false)}>
        <Modal.Header>Change Status</Modal.Header>
        <Modal.Body>
          <Select
            value={statusVal}
            onChange={handleStatusChange}
            disabled={isSelectDisabled}
          >
            <option value={"repo"}>Repo</option>
            <option value={"release"}>Release</option>
            <option value={"hold"}>Hold</option>
          </Select>
        </Modal.Body>
      </Modal>
    </>
  );
};
