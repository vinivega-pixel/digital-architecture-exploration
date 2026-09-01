import { useParams } from 'react-router-dom';
import Workspace from './Workspace';
import NotFound from './NotFound';

const CODE = /^id\d{4}$/i;

/** Адрес вида /id0034 открывает кабинет с этим номером. */
const CabinetRoute = () => {
  const { code } = useParams();
  if (!code || !CODE.test(code)) return <NotFound />;
  return <Workspace code={code.toUpperCase()} />;
};

export default CabinetRoute;
