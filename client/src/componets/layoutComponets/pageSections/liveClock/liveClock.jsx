import { useLiveDateTime } from "../../../../utills/helpers/funtions";
import { H3 } from "../../../singleComponets/heading/heading";


export default function LiveClock() {
  const currentDate = useLiveDateTime();
  return (
    <>
      <H3>{currentDate}</H3>
    </>
  );
}
