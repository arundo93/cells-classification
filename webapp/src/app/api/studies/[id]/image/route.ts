import {getStudyImage} from '@/shared/services/studies';

import {type NextRequest, NextResponse} from 'next/server';

type RouteParams = {
	params: Promise<{id: string}>;
};

export async function GET(_request: NextRequest, {params}: RouteParams) {
	const {id} = await params;
	const image = await getStudyImage(id);
	if (image) {
		return new Response(image, {
			headers: {
				'Content-Type': 'application/octet-stream',
			},
		});
	}

	return NextResponse.json({error: 'Study not found'}, {status: 404});
}
