import CodeEditor from "@/components/editor/CodeEditor";

const Page = async ({ params }: any) => {
    const {assignmentId} = params;
    return (
        <>
        <h2 className="text-2xl py-2 text-center">Assignment {assignmentId}</h2>
        <CodeEditor />
      </>
  )
}

export default Page