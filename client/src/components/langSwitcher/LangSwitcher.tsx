/* eslint-disable react-hooks/exhaustive-deps */
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react'
import { useState } from 'react';
export default function LangSwitcher() {
  const [age, setAge] = useState(localStorage.getItem('lang') || 'en');
  const { i18n } = useTranslation()
  const { t } = useTranslation()
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
    localStorage.setItem('lang', event.target.value)
  };
  useEffect(() => {
    const lang = localStorage.getItem('lang') || 'en'
    i18n.changeLanguage(lang)
  },[age])
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label">{t('nav-language')}</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={age}
        label={t('nav-language')}
        onChange={handleChange}
      >
      <MenuItem value='uz'>Uzbek</MenuItem>
      <MenuItem value='en'>English</MenuItem>
      </Select>
    </FormControl>
  );
}
