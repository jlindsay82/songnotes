import {useState, useEffect, useCallback} from 'react';
import './styles/toast.css';

const Toast = ({message, duration = 3000}) => {

    const [classNames, setClassNames] = useState("toast show");

    useEffect(() => {
        setTimeout(() => {
            hideToast();
        }, duration);
    }, []);

    const hideToast = () => {
        setClassNames('toast');
    };
    
    return ( 
    <>
        <div className={`${classNames} flex-container`}>
            <span>{message}</span>
            <span className="close" onClick={hideToast}>x</span>

        </div>
    </>  
     );
}
 
export default Toast;