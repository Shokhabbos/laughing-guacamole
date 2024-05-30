import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Collection } from '../../types/ElementTypes';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminTable.scss'
import { t } from 'i18next';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#2962ff',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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

export default function AdminTable({ collections, collectionIds, setCollectionIds }: { collections: Collection[], collectionIds: string[], setCollectionIds: React.Dispatch<React.SetStateAction<string[]>> }) {
  
  const [isAllChecked, setIsAllChecked] = useState<boolean>(false);
  
  const handleCheckboxChange = (collectionId: string) => {
    const updatedSelectedCollectionIds = collectionIds.includes(collectionId)
      ? collectionIds.filter((id) => id !== collectionId)
      : [...collectionIds, collectionId];

    setCollectionIds(updatedSelectedCollectionIds);
    setIsAllChecked(updatedSelectedCollectionIds.length === collections.length);
  };

  const handleSelectAllChange = () => {
    const allChecked = !isAllChecked;
    setIsAllChecked(allChecked);
    setCollectionIds(allChecked ? collections.map((row) => row._id) : []);
  };
  
  return (
    collectionIds && (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">
                <input
                  type="checkbox"
                  className={
                    !isAllChecked && collectionIds.length > 0
                      ? 'custom-checkbox-minus'
                      : 'custom-checkbox'
                  }
                  onChange={handleSelectAllChange}
                  checked={isAllChecked}
                />
              </StyledTableCell>
              <StyledTableCell align="left">{t('collection-name')}</StyledTableCell>
              <StyledTableCell align="left">{t('topic')}</StyledTableCell>
              <StyledTableCell align="left">{t('items-count')}</StyledTableCell>
              <StyledTableCell align="left">{t('description')}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collections.map((row) => (
              <StyledTableRow key={row._id}>
                <StyledTableCell component="th" scope="row">
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={collectionIds.includes(row._id)}
                    onChange={() => handleCheckboxChange(row._id)}
                  />
                </StyledTableCell>
                <StyledTableCell align="left"><Link to={`/admin-single-col/${row.name}`}>{row.name}</Link></StyledTableCell>
                <StyledTableCell align="left">{row.topic}</StyledTableCell>
                <StyledTableCell align="left">{row.items.length}</StyledTableCell>
                <StyledTableCell className='collection-table-description' align="left">{row.discreption}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  );
}
