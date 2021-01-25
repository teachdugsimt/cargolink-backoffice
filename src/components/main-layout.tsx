import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { LayoutColumn } from '@paljs/ui/Layout';
import { useTranslation } from 'react-i18next';
import { useMst } from '../stores/root-store';
import '../Layouts/css/style.css';

const MainLayout: React.FC<{ children: any }> = observer(({ children }) => {
  const { loginStore } = useMst();
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(loginStore.language);
    console.log('language:>>', loginStore.language);
  }, []);

  return <LayoutColumn className="main-content">{children}</LayoutColumn>;
});

export default MainLayout;
