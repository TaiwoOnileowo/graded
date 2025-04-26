const Page = async ({ params }: any) => {
    const {assignmentId} = params;
  return (
    <div>Assignment Editor for assignment {assignmentId}</div>
  )
}

export default Page