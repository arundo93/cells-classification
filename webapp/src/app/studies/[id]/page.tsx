import {getStudyDetails} from './_services/studyDetails';
import {StudyDetail} from './_ui/StudyDetail';
import {notFound} from 'next/navigation';

type PageProps = {
	params: Promise<{
		id: string;
	}>;
};

export default async function Page({params}: PageProps) {
	const {id} = await params;
	const details = await getStudyDetails(id);
	const {study, rawResult} = details;

	if (!study) {
		notFound();
	}

	return <StudyDetail study={study} rawResult={rawResult} />;
}
