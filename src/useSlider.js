import { useReducer, useRef, useCallback, useEffect } from "react";

const fixRatio = ratio => Math.max(0, Math.min(1, ratio));

const reducer = (state, action) => {
    const { horizon } = state;
    switch (action.type) {
        case "setRatio":
            if (!state.reset || action.ratio !== state.ratio) {
                return {
                    ...state,
                    ratio: fixRatio(action.ratio),
                    reset: true
                };
            }
            return state;
        case "start":
            return {
                ...state,
                lastPos: horizon ? action.x : -action.y,
                slideRange: horizon ? action.slideWidth : action.slideHeight,
                sliding: true,
                reset: false
            };
        case "move": {
            if (!state.sliding) {
                return state;
            }
            const pos = horizon ? action.x : -action.y;
            const delta = pos - state.lastPos;
            return {
                ...state,
                lastPos: pos,
                ratio: fixRatio(state.ratio + delta / state.slideRange),
                reset: false
            };
        }
        case "end": {
            if (!state.sliding) {
                return state;
            }
            const pos = horizon ? action.x : -action.y;
            const delta = pos - state.lastPos;
            return {
                ...state,
                lastPos: pos,
                ratio: fixRatio(state.ratio + delta / state.slideRange),
                sliding: false,
                reset: false
            };
        }
        case "to":
            return {
                ...state,
                ratio: fixRatio(
                    horizon
                        ? action.x / action.slideWidth
                        : (action.slideHeight - action.y) / action.slideHeight
                ),
                sliding: false,
                reset: false
            };
        default:
            return state;
    }
};

const useSlider = props => {
    const { horizon, initRatio = 0 } = props;

    const [state, dispatch] = useReducer(reducer, {
        horizon,
        ratio: initRatio,
        reset: true
    });

    const hotAreaRef = useRef(null);
    const thumbRef = useRef(null);

    const handleHotAreaMouseDown = useCallback(ev => {
        const hotArea = hotAreaRef.current;
        dispatch({
            type: "to",
            x: ev.nativeEvent.offsetX,
            y: ev.nativeEvent.offsetY,
            slideWidth: hotArea.clientWidth,
            slideHeight: hotArea.clientHeight
        });
    }, []);

    const handleThumbMouseDown = useCallback(ev => {
        const hotArea = hotAreaRef.current;
        dispatch({
            type: "start",
            x: ev.pageX,
            y: ev.pageY,
            slideWidth: hotArea.clientWidth,
            slideHeight: hotArea.clientHeight
        });
    }, []);

    useEffect(() => {
        const onSliding = ev => {
            dispatch({
                type: "move",
                x: ev.pageX,
                y: ev.pageY
            });
        };
        const onSlideEnd = ev => {
            dispatch({
                type: "end",
                x: ev.pageX,
                y: ev.pageY
            });
        };
        document.addEventListener("mousemove", onSliding);
        document.addEventListener("mouseup", onSlideEnd);

        return () => {
            document.removeEventListener("mousemove", onSliding);
            document.removeEventListener("mouseup", onSlideEnd);
        };
    }, []);

    const setRatio = useCallback(
        ratio =>
            dispatch({
                type: "setRatio",
                ratio
            }),
        []
    );

    return [
        {
            ref: hotAreaRef,
            onMouseDown: handleHotAreaMouseDown
        },
        {
            ref: thumbRef,
            onMouseDown: handleThumbMouseDown
        },
        {
            ratio: state.ratio,
            reset: state.reset,
            sliding: state.sliding,
            setRatio
        }
    ];
};

export default useSlider;
