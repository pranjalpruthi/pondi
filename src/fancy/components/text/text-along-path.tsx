import { type RefObject, useEffect, useRef } from "react"
import {
  useScroll,
  type UseScrollOptions,
  useTransform,
} from "motion/react"

type PreserveAspectRatioAlign =
  | "none"
  | "xMinYMin"
  | "xMidYMin"
  | "xMaxYMin"
  | "xMinYMid"
  | "xMidYMid"
  | "xMaxYMid"
  | "xMinYMax"
  | "xMidYMax"
  | "xMaxYMax"

type PreserveAspectRatioMeetOrSlice = "meet" | "slice"

type PreserveAspectRatio =
  | PreserveAspectRatioAlign
  | `${Exclude<PreserveAspectRatioAlign, "none">} ${PreserveAspectRatioMeetOrSlice}`

interface AnimatedPathTextProps {
  // Path properties
  path: string
  pathId?: string
  pathClassName?: string
  preserveAspectRatio?: PreserveAspectRatio
  showPath?: boolean

  // SVG properties
  width?: string | number
  height?: string | number
  viewBox?: string
  svgClassName?: string

  // Text properties
  text: string
  textClassName?: string
  textAnchor?: "start" | "middle" | "end"

  // Animation properties
  animationType?: "auto" | "scroll"

  // Animation properties if animationType is auto
  duration?: number
  repeatCount?: number | "indefinite"
  easingFunction?: {
    calcMode?: string
    keyTimes?: string
    keySplines?: string
  }

  // Scroll animation properties if animationType is scroll
  scrollContainer?: RefObject<HTMLElement>
  scrollOffset?: UseScrollOptions["offset"]
  scrollTransformValues?: [number, number]
}

const AutoAnimatedPath = ({
  path,
  pathId,
  pathClassName,
  preserveAspectRatio,
  showPath,
  width,
  height,
  viewBox,
  svgClassName,
  text,
  textClassName,
  textAnchor,
  duration,
  repeatCount,
  easingFunction,
}: Omit<
  AnimatedPathTextProps,
  "animationType" | "scrollContainer" | "scrollOffset" | "scrollTransformValues"
>) => {
  const id =
    pathId || `animated-path-${Math.random().toString(36).substring(7)}`

  const animationProps = {
    from: "0%",
    to: "100%",
    begin: "0s",
    dur: `${duration}s`,
    repeatCount: repeatCount,
    ...(easingFunction && easingFunction),
  }

  return (
    <svg
      className={svgClassName}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
    >
      <path
        id={id}
        className={pathClassName}
        d={path}
        stroke={showPath ? "currentColor" : "none"}
        fill="none"
      />
      <text textAnchor={textAnchor} fill="currentColor">
        <textPath className={textClassName} href={`#${id}`} startOffset={"0%"}>
          <animate attributeName="startOffset" {...animationProps} />
          {text}
        </textPath>
      </text>
      <text textAnchor={textAnchor} fill="currentColor">
        <textPath
          className={textClassName}
          href={`#${id}`}
          startOffset={"-100%"}
        >
          <animate
            attributeName="startOffset"
            {...animationProps}
            from="-100%"
            to="0%"
          />
          {text}
        </textPath>
      </text>
    </svg>
  )
}

const ScrollAnimatedPath = ({
  path,
  pathId,
  pathClassName,
  preserveAspectRatio,
  showPath,
  width,
  height,
  viewBox,
  svgClassName,
  text,
  textClassName,
  textAnchor,
  scrollContainer,
  scrollOffset,
  scrollTransformValues,
}: Omit<
  AnimatedPathTextProps,
  "animationType" | "duration" | "repeatCount" | "easingFunction"
>) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const textPathRef = useRef<SVGTextPathElement>(null)
  const id =
    pathId || `animated-path-${Math.random().toString(36).substring(7)}`

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainer,
    offset: scrollOffset,
  })

  const startOffset = useTransform(
    scrollYProgress,
    [0, 1],
    scrollTransformValues || [0, 100],
  )

  useEffect(() => {
    const unsubscribe = startOffset.on("change", (latest) => {
      if (textPathRef.current) {
        textPathRef.current.setAttribute("startOffset", `${latest}%`)
      }
    })
    return unsubscribe
  }, [startOffset])

  return (
    <div ref={containerRef} className={svgClassName}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox={viewBox}
        preserveAspectRatio={preserveAspectRatio}
      >
        <path
          id={id}
          className={pathClassName}
          d={path}
          stroke={showPath ? "currentColor" : "none"}
          fill="none"
        />
        <text textAnchor={textAnchor} fill="currentColor">
          <textPath
            ref={textPathRef}
            className={textClassName}
            href={`#${id}`}
            startOffset={`${(scrollTransformValues || [0])[0]}%`}
          >
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  )
}

const AnimatedPathText = ({
  // Path defaults
  path,
  pathId,
  pathClassName,
  preserveAspectRatio = "xMidYMid meet",
  showPath = false,

  // SVG defaults
  width = "100%",
  height = "100%",
  viewBox = "0 0 100 100",
  svgClassName,

  // Text defaults
  text,
  textClassName,
  textAnchor = "start",

  // Animation type
  animationType = "auto",

  // Animation defaults
  duration = 4,
  repeatCount = "indefinite",
  easingFunction = {},

  // Scroll animation defaults
  scrollContainer,
  scrollOffset = ["start end", "end end"],
  scrollTransformValues = [0, 100],
}: AnimatedPathTextProps) => {
  const commonProps = {
    path,
    pathId,
    pathClassName,
    preserveAspectRatio,
    showPath,
    width,
    height,
    viewBox,
    svgClassName,
    text,
    textClassName,
    textAnchor,
  }

  if (animationType === "scroll") {
    return (
      <ScrollAnimatedPath
        {...commonProps}
        scrollContainer={scrollContainer}
        scrollOffset={scrollOffset}
        scrollTransformValues={scrollTransformValues}
      />
    )
  }

  return (
    <AutoAnimatedPath
      {...commonProps}
      duration={duration}
      repeatCount={repeatCount}
      easingFunction={easingFunction}
    />
  )
}

export default AnimatedPathText
