import PropTypes from 'prop-types'

const Slider = ({title, min, max, count, onMouseUp, onKeyUp}) => {
    return (
        <div className="slide-container">
            {title} : {count}
            <input onMouseUp={onMouseUp} onKeyUp={onKeyUp} type="range" min={min} max={max} defaultValue="10" className="slider" />
        </div>
    )
}

Slider.propTypes = {
    title: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    counter: PropTypes.number,
    onMouseUp: PropTypes.func,
    onKeyUp: PropTypes.func,
}

export default Slider;
