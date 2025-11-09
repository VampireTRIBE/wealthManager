import { H3 } from "../../../singleComponets/heading/heading";
import { useLiveDateTime } from "../../../../utills/helpers/funtions";

export default function LiveClock() {
  const currentDate = useLiveDateTime();
  return (
    <>
      <H3>{currentDate}</H3>
    </>
  );
}
