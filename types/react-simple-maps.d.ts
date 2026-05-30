declare module "react-simple-maps" {
  import { ComponentType, ReactNode, SVGAttributes } from "react"

  export interface ComposableMapProps {
    projection?: string
    projectionConfig?: {
      scale?: number
      center?: [number, number]
      rotate?: [number, number, number]
      parallels?: [number, number]
    }
    width?: number
    height?: number
    style?: React.CSSProperties
    className?: string
    children?: ReactNode
  }

  export interface ZoomableGroupProps {
    center?: [number, number]
    zoom?: number
    minZoom?: number
    maxZoom?: number
    translateExtent?: [[number, number], [number, number]]
    onMoveStart?: (position: { coordinates: [number, number]; zoom: number }) => void
    onMove?: (position: { coordinates: [number, number]; zoom: number }) => void
    onMoveEnd?: (position: { coordinates: [number, number]; zoom: number }) => void
    children?: ReactNode
  }

  export interface GeographiesProps {
    geography: string | object
    children: (data: { geographies: any[] }) => ReactNode
    parseGeographies?: (geographies: any[]) => any[]
  }

  export interface GeographyProps {
    geography: any
    style?: {
      default?: SVGAttributes<SVGPathElement>
      hover?: SVGAttributes<SVGPathElement>
      pressed?: SVGAttributes<SVGPathElement>
    }
    onMouseEnter?: (event: React.MouseEvent<SVGPathElement>) => void
    onMouseLeave?: (event: React.MouseEvent<SVGPathElement>) => void
    onClick?: (event: React.MouseEvent<SVGPathElement>) => void
    onMouseDown?: (event: React.MouseEvent<SVGPathElement>) => void
    onMouseUp?: (event: React.MouseEvent<SVGPathElement>) => void
    onFocus?: (event: React.FocusEvent<SVGPathElement>) => void
    onBlur?: (event: React.FocusEvent<SVGPathElement>) => void
    className?: string
  }

  export interface MarkerProps {
    coordinates: [number, number]
    style?: {
      default?: SVGAttributes<SVGGElement>
      hover?: SVGAttributes<SVGGElement>
      pressed?: SVGAttributes<SVGGElement>
    }
    children?: ReactNode
    onMouseEnter?: (event: React.MouseEvent<SVGGElement>) => void
    onMouseLeave?: (event: React.MouseEvent<SVGGElement>) => void
    onClick?: (event: React.MouseEvent<SVGGElement>) => void
    className?: string
  }

  export interface AnnotationProps {
    subject: [number, number]
    dx?: number
    dy?: number
    curve?: number
    connectorProps?: SVGAttributes<SVGPathElement>
    children?: ReactNode
  }

  export interface LineProps {
    from: [number, number]
    to: [number, number]
    coordinates?: [number, number][]
    stroke?: string
    strokeWidth?: number
    strokeLinecap?: string
    fill?: string
    className?: string
  }

  export interface GraticuleProps {
    stroke?: string
    strokeWidth?: number
    fill?: string
    step?: [number, number]
    className?: string
  }

  export interface SphereProps {
    id?: string
    fill?: string
    stroke?: string
    strokeWidth?: number
    className?: string
  }

  export const ComposableMap: ComponentType<ComposableMapProps>
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>
  export const Geographies: ComponentType<GeographiesProps>
  export const Geography: ComponentType<GeographyProps>
  export const Marker: ComponentType<MarkerProps>
  export const Annotation: ComponentType<AnnotationProps>
  export const Line: ComponentType<LineProps>
  export const Graticule: ComponentType<GraticuleProps>
  export const Sphere: ComponentType<SphereProps>
}
