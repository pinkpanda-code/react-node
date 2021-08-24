import PropTypes from 'prop-types'

const Button = ({text, onClick}) => {
    return (
        <button onClick={onClick} type="button">
            {text}
        </button>
    )
}

Button.propTypes = {
    text: PropTypes.string,
}

export default Button;
