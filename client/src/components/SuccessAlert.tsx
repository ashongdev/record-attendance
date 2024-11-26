import { Dispatch, FC, SetStateAction } from "react";
import checkmark from "../images/checkmark.png";

interface Props {
	successMessage: string;
	setShowSuccessMessage: Dispatch<SetStateAction<boolean>>;
}
const ErrorAlert: FC<Props> = ({ successMessage, setShowSuccessMessage }) => {
	return (
		<div className="error-alert-container">
			<div className="error-alert">
				<div className="alert-content">
					<div className="icon-container">
						<img
							src={checkmark}
							className="icon"
						/>
					</div>
					<div className="alert-text">
						<p className="alert-title">Success</p>
						<p className="alert-description">{successMessage}</p>
					</div>
				</div>
				<button
					className="close-button"
					onClick={() => setShowSuccessMessage(false)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="icon"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 18 18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default ErrorAlert;
