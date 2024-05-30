import { useEffect, useState } from "react";
import { Button, Tooltip } from "@mui/material";
import { Container } from "../../utils/Utils";
import { CiLock, CiUnlock } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "../../api/axios";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ToastContainer, toast } from "react-toastify";
import instance from "../../api/axios";
import { UserManagement } from "../../types/ElementTypes";
import './Users.scss'
import AdminNav from "../../components/adminNav/AdminNav";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { logOut } from "../../redux/features/authSlice";
import { GrUserAdmin } from "react-icons/gr";
import { RiAdminFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Users = () => {
  const [usersData, setUsersData] = useState<UserManagement[] | undefined>();
  const [rows, setRows] = useState<UserManagement[]>([]);
  const [userIds, setSelectedUserIds] = useState<string[]>([]);
  const [isAllChecked, setIsAllChecked] = useState<boolean>(false);
  const userId = useSelector((state:RootState) => state.auth.user?._id) as string
  const dispatch = useDispatch<AppDispatch>()
  const {t}=useTranslation()
  const headers = {
    'Content-Type': 'application/json'
  }
  useEffect(() => {
    axios.get("/user")
      .then((response) => setUsersData(response.data))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  function getTime(dayTime: string) {
    const [day, time] = dayTime.split(" ");
    const paddedDay = day.split("-").map((d) => (d.length < 2 ? "0" + d : d)).join("-");
    const paddedTime = time.split(":").map((t) => (t.length < 2 ? "0" + t : t)).join(":");
    return paddedDay + " " + paddedTime;
  }

  useEffect(() => {
    if (usersData) {
      const updatedRows:any = usersData.map((user:any) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role:user.role.charAt(0).toUpperCase() + user.role.slice(1),
        lstLogTime: getTime(user.lstLogTime),
        regTime: getTime(user.regTime),
        status: user.status ? "Active" : "Blocked",
      }));
      setRows(updatedRows);
    }
  }, [usersData]);
  const handleCheckboxChange = (userId: string) => {
    const updatedSelectedUserIds = userIds.includes(userId)
      ? userIds.filter((id) => id !== userId)
      : [...userIds, userId];
    setSelectedUserIds(updatedSelectedUserIds);
    setIsAllChecked(updatedSelectedUserIds.length === rows.length);
  };
  const handleSelectAllChange = () => {
    const allChecked = !isAllChecked;
    setIsAllChecked(allChecked);
    setSelectedUserIds(allChecked ? rows.map((row) => row.id) : []);
  };
  const handleDeleteUsers = () => {
      instance
        .delete("/user/delete", { data: { userIds: userIds }, headers })
        .then((response) => {
          if (response.status === 200) {
            setRows((prevRows) => prevRows.filter((row) => !userIds.includes(row.id)));
            setSelectedUserIds([]);
            setIsAllChecked(false);
            toast.success("Users deleted!");
          }
        })
        .catch((error) => console.error("Error deleting users:", error));
  };
  const handleBlockUsers = () => {
    instance
      .patch("/user/update", { userIds: userIds, status: "false" }, {headers})
      .then((response) => {
        if (response.status === 200) {
          setRows((prevRows) => prevRows.map((row) => ({
            ...row,
            status: userIds.includes(row.id) ? "Blocked" : row.status,
          })));
          if (userIds.includes(userId)) {
            dispatch(logOut())
          }
          setSelectedUserIds([]);
          setIsAllChecked(false);
          toast.success("Users blocked!");
        }
      })
      .catch((error) => console.error("Error blocking users:", error));
  };
  const handleUnlockUsers = () => {
    instance
    .patch("/user/update", { userIds: userIds, status: "true" }, {headers})
    .then((response) => {
      if (response.status === 200) {
        setRows((prevRows) => prevRows.map((row) => ({
          ...row,
          status: userIds.includes(row.id) ? "Active" : row.status,
        })));
        if (userIds.includes(userId)) {
          dispatch(logOut())
        }
        setSelectedUserIds([]);
        setIsAllChecked(false);
        toast.success("Users unblocked!");
      }
    })
    .catch((error) => console.error("Error blocking users:", error));
  };
  const handlePromoteToAdmin = () => {
    instance
    .post("/user/add-admin", { userIds: userIds, role: "admin" }, {headers})
    .then((response) => {
      if (response.status === 200) {
        setRows((prevRows) => prevRows.map((row) => ({
          ...row,
          role: userIds.includes(row.id) ? "Admin" : row.role,
        })));
        if (userIds.includes(userId)) {
          dispatch(logOut())
        }
        setSelectedUserIds([]);
        setIsAllChecked(false);
        toast.success("Promoted to admin!");
      }
    })
    .catch((error) => console.error("Error blocking users:", error));
  }
  const handleRemoveFromAdmin = () => {
    instance
    .post("/user/rm-admin", { userIds: userIds, role: "admin" }, {headers})
    .then((response) => {
      if (response.status === 200) {
        setRows((prevRows) => prevRows.map((row) => ({
          ...row,
          role: userIds.includes(row.id) ? "User" : row.role,
        })));
        if (userIds.includes(userId)) {
          dispatch(logOut())
        }
        setSelectedUserIds([]);
        setIsAllChecked(false);
        toast.success("Removed from admin!");
      }
    })
    .catch((error) => console.error("Error blocking users:", error));
  }
  console.log(usersData)
  return (
    <>
      <AdminNav/>
      <Container>
        <div className="actions-wrapper">
          <Button
            sx={{ display: "flex", alignItems: "center", gap: "5px" }}
            color="error"
            variant="contained"
            onClick={handleBlockUsers}
          >
            <CiLock className="lock-icon" /> {t('block')}
          </Button>
          <Tooltip title={t("unblock")} placement="top">
            <Button onClick={handleUnlockUsers} className="custom-hover">
              <CiUnlock className="unlock-icon" />
            </Button>
          </Tooltip>
          <Tooltip title={t("delete")} placement="top">
            <Button onClick={handleDeleteUsers} className="custom-hover">
              <RiDeleteBinLine className="unlock-icon" />
            </Button>
          </Tooltip>
          <Tooltip title={t("promoteAdmin")} placement="top">
            <Button onClick={handlePromoteToAdmin} className="custom-hover">
              <GrUserAdmin className="unlock-icon" />
            </Button>
          </Tooltip>
          <Tooltip title={t("deleteAdmin")} placement="top">
            <Button onClick={handleRemoveFromAdmin} className="custom-hover">
              <RiAdminFill className="unlock-icon" />
            </Button>
          </Tooltip>
        </div>
        <p style={{ fontSize: "20px", marginBottom: "20px" }}>Users Table</p>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">
                  <input
                    type="checkbox"
                    className={
                      !isAllChecked && userIds.length > 0
                        ? "custom-checkbox-minus"
                        : "custom-checkbox"
                    }
                    onChange={handleSelectAllChange}
                    checked={isAllChecked}
                  />
                </StyledTableCell>
                <StyledTableCell align="left">ID</StyledTableCell>
                <StyledTableCell align="left">{t('name')}</StyledTableCell>
                <StyledTableCell align="left">Email</StyledTableCell>
                <StyledTableCell align="left">{t('role')}</StyledTableCell>
                <StyledTableCell align="left">{t('status')}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={userIds.includes(row.id)}
                      onChange={() => handleCheckboxChange(row.id)}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="left">{row.id}</StyledTableCell>
                  <StyledTableCell align="left">{row.name}</StyledTableCell>
                  <StyledTableCell align="left">{row.email}</StyledTableCell>
                  <StyledTableCell align="left">{row.role}</StyledTableCell>
                  <StyledTableCell align="left">{row.status}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <ToastContainer />
      </Container>
    </>
  );
};

export default Users;
