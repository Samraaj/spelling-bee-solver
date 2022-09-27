import fs from 'fs';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import wordListPath from 'word-list';

type PageParams = {
	letters: string;
};

export async function getServerSideProps(context: GetServerSidePropsContext<PageParams>) {
	const lettersString = context.params?.letters.toLowerCase();
	const lettersArray = lettersString?.split('');

	if (!lettersString || !lettersArray || !lettersArray.length) {
		return {
			letters: '',
		};
	}

	const requiredLetter = lettersArray[0];
	// regex expression ^[letters]*$
	const regex = new RegExp(`^[${lettersString}]*$`);

	const wordArray = fs.readFileSync(wordListPath, 'utf8').split('\n');
	console.log('wordArray length', wordArray.length);

	const filteredWords = wordArray.filter((word) => {
		if (word.length < 4 || !word.includes(requiredLetter)) {
			return false;
		}
		return regex.test(word);
	});

	const sortedFilteredWords = filteredWords.sort((a, b) => b.length - a.length);

	return {
		props: {
			requiredLetter: requiredLetter,
			letters: lettersString,
			words: sortedFilteredWords,
		},
	};
}

function Page({
	requiredLetter,
	letters,
	words,
}: {
	requiredLetter: string;
	letters: string;
	words: string[];
}) {
	return (
		<>
			<Head>
				<title>Spelling Bee {letters}</title>
			</Head>
			<div className="flex h-screen flex-col items-center gap-5 bg-[#F2DB50] px-10 pt-[5%] text-center text-black">
				<img src="/spellingbee.png" alt="bee" className="w-24" />
				<div className="text-xl font-bold">
					{letters.toUpperCase()} with {requiredLetter.toUpperCase()} required
				</div>
				<div className="flex h-1/2 w-full flex-col gap-2 overflow-y-scroll text-lg">
					<div>
						{words.map((word) => (
							<div key={word}>{word}</div>
						))}
					</div>
				</div>
				<div className="text-sm font-light text-gray-500">
					NOTE: I am not liable for damages when people realize you are a filthy cheater
				</div>
			</div>
		</>
	);
}

export default Page;
