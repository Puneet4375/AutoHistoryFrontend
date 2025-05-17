import ClipLoader from "react-spinners/ClipLoader";

function Spinner() {
  return (
    <div className="position-fixed d-flex justify-content-center align-items-center w-100" style={{height:'100vh',background:'#00000035',zIndex:'100000'}}>
    <ClipLoader color="#36d7b7" size={50} />
  </div>
  );
}

export default Spinner;
