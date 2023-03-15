import PageTwo from "../../assets/images/PageTwo.svg";
import styles from "./newDeal.module.css";
import { Form, Button } from "react-bootstrap";
import copyIcon from "../../assets/icons/copyIcon.png";
import shareIcon from "../../assets/icons/shareIcon.png";
import { useNavigate } from 'react-router-dom'

const DealSuccess = ({dealLink}) => {
  const navigate = useNavigate();
  const handleCopy = () => {
    navigator.clipboard.writeText(dealLink);
  }
  const handleClick = () => {
    navigate("/dashboard");
  }
  const handleRedirection = () => {
    window.open(dealLink, '_blank');
  }

  return (
    <div className={`border mt-3 ${styles.formDiv}`}>
      <div className={styles.image}>
        <img src={PageTwo} className={styles.imageWidth} />
      </div>
      <div className={`mt-4 mb-4 ${styles.text}`}>
        The deal is successful.<br></br>Here is the link of it!
      </div>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className={`${styles.label} ${styles.block}`}>
            URL
          </Form.Label>
          <div className="d-flex">
          <input
            className={`form-control ${styles.customInput} ${styles.inputWidth}`}
            type="text"
            name="url"
            placeholder={dealLink}
            readOnly
            onClick={handleRedirection}
          />
          <span className={`border ${styles.copySpan}`} onClick={handleCopy}>
            <img src={copyIcon} className={styles.image} />
          </span>
          <span className={`border ${styles.copySpan}`}>
            <img src={shareIcon} className={styles.image} />
          </span>
          </div>
        </Form.Group>
        <Button onClick={handleClick} className={`${styles.nextBtn} mt-3 mb-3`}>Finish</Button>
      </Form>
    </div>
  );
};

export default DealSuccess;
