import useIsMobile from "@/hooks/useIsMobile";
import ContainerDimensions from "react-container-dimensions";
import { Shimmer } from "react-shimmer";

type Props = {};

function PathwayStructureShimmer({}: Props) {
  const isMobile = useIsMobile();
  console.log("isMobile", isMobile);

  return (
    <div className="felx flex-col space-y-6 mt-20 mx-10">
      <ContainerDimensions>
        {({ width, height }) => (
          <>
            <Shimmer className="w-full rounded-md" width={width} height={75} />
            <Shimmer className="w-full rounded-md" width={width} height={75} />
            <Shimmer className="w-full rounded-md" width={width} height={75} />
            <Shimmer className="w-full rounded-md" width={width} height={75} />
          </>
        )}
      </ContainerDimensions>
    </div>
  );
}

export default PathwayStructureShimmer;
