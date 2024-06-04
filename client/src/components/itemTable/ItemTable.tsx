import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${theme.palette.mode === 'light' ? 'head' : 'body'}`]: {
    backgroundColor: '#2962ff',
    color: theme.palette.common.white,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function ItemsTable({ items, itemIds, setItemIds } : { items: any[], itemIds: string[], setItemIds: React.Dispatch<React.SetStateAction<string[]>>}) {
  const [isAllChecked, setIsAllChecked] = useState<boolean>(false);
  const {t} = useTranslation()
  const handleCheckboxChange = (itemId: string) => {
    const updatedSelectedIds = itemIds.includes(itemId)
      ? itemIds.filter((id) => id !== itemId)
      : [...itemIds, itemId];

    setItemIds(updatedSelectedIds);
    setIsAllChecked(updatedSelectedIds.length === items.length);
  };

  const handleSelectAllChange = () => {
    const allChecked = !isAllChecked;
    setIsAllChecked(allChecked);
    setItemIds(allChecked ? items.map((item) => item._id) : []);
  };

  return (
    itemIds && (
      <TableContainer sx={{marginBottom:10}} component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">
                <input
                  type="checkbox"
                  className={`custom-checkbox${!isAllChecked && itemIds.length > 0 ? '-minus' : ''}`}
                  onChange={handleSelectAllChange}
                  checked={isAllChecked}
                />
              </StyledTableCell>
              <StyledTableCell align="left">{t('item-name')}</StyledTableCell>
              <StyledTableCell align="left">{t('tags')}</StyledTableCell>
              <StyledTableCell align="left">{t('likes')[0].toUpperCase()+t('likes').slice(1)}</StyledTableCell>
              <StyledTableCell align="left">{t('comments')[0].toUpperCase()+t('comments').slice(1)}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row) => (

              <StyledTableRow key={row._id}>
                <StyledTableCell component="th" scope="row">
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={itemIds.includes(row._id)}
                    onChange={() => handleCheckboxChange(row._id)}
                  />
                </StyledTableCell>
                <StyledTableCell align="left">
                  <Link to={`/admin-single-col/${row.name}`}>{row.name}</Link>
                </StyledTableCell>
                <StyledTableCell align="left">{row.tags}</StyledTableCell>
                <StyledTableCell align="left">{row.likes.length}</StyledTableCell>
                <StyledTableCell align="left">
                  {row.comments.length}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  );
}
