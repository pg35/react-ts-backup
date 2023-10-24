import ConditionList from "./ConditionList";
function InquiryFields(props) {
  return <p>this is inquiry fields</p>;
}

const ID2Control = {
  InquiryFields: InquiryFields,
  ConditionList: ConditionList
};
export default function Section({ data, config }) {
  let Control = ID2Control[config.control];
  return (
    <section>
      {config.label && <h2>{config.label}</h2>}
      {<Control data={data} />}
    </section>
  );
}
