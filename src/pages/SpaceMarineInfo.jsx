import { useParams } from 'react-router-dom';
import Header from "../components/Header";
import SpaceMarineCard from '../components/domain/SpaceMarineInfo';

const SpaceMarinoInfo = () => {
  const { id } = useParams();

  return (
    <>
      <Header />
      <SpaceMarineCard id={id} />
    </>
  );
};

export default SpaceMarinoInfo;
