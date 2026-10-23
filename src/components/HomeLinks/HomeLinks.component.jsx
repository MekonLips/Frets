import InstallFretsButton from "../InstallFretsButton/InstallFretsButton.component";
import LearnYourFretsButton from "../LearnYourFretsButton/LearnYourFretsButton.component";

const HomeLinksComponent = ({ match = () => {} } = {}) => {
    return <div className="home-links">
        <LearnYourFretsButton />
        {!match.params.exercise && <InstallFretsButton />}
    </div>
};

export default HomeLinksComponent;