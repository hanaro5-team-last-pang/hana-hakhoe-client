interface Props {
  lectureDescription: string;
}

export default function MentoringDescriptionForm(props: Props) {
  const { lectureDescription } = props;

  return <p className="p-10 whitespace-pre-line">{lectureDescription}</p>;
}
