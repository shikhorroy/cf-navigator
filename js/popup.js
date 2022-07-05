// Define Constants
const CODEFORCES_CONTEST = /https:\/\/codeforces.com\/contest\/\d+/g;
const CODEFORCES_CONTEST_PROBLEM = /https:\/\/codeforces.com\/contest\/\d+\/problem\/[A-Za-z]\d*/g;
const CODEFORCES_PROBLEM_SET_PROBLEM = /https:\/\/codeforces.com\/problemset\/problem\/\d+\/[A-Za-z]\d*/g;

const fetchCodeforcesContestInfo = async (contestId) => {
    const response = await fetch(`https://codeforces.com/api/contest.standings?contestId=${contestId}&from=1&count=1`);
    return await response.json();
}

chrome.tabs.query({active: true, currentWindow: true}).then((tab) => {
    if (tab.length > 0) {
        const url = tab[0].url;
        if (url.search(CODEFORCES_CONTEST_PROBLEM) === 0 || url.search(CODEFORCES_CONTEST) === 0
            || url.search(CODEFORCES_PROBLEM_SET_PROBLEM) === 0) {
            const numberList = url.match(/\d+/);
            if (numberList.length > 0) {
                const contestId = numberList[0];
                const parts = url.split('\/');
                let problemNo = null;
                if (parts.length === 7) problemNo = parts[parts.length - 1];

                fetchCodeforcesContestInfo(contestId).then(contest => {
                    console.log(contest);
                    if (contest.status === 'OK') {
                        const result = contest.result;
                        const problems = result['problems'];

                        let innerHTML = ``;
                        if (problems) for (let i = 0, ln = problems.length; i < ln; i++) {
                            const problem = problems[i];
                            let problemUrl = `https://codeforces.com/contest/${contestId}/problem/${problem.index}`;
                            const item =
                                `<p style="font-size: 15px;">
                                                    ${problemNo === problem.index ? '[' : ''}
                                                    <a href="${problemUrl}" target="_blank" style="text-decoration: none;font-weight: bold;">${problem.index}</a>
                                                    ${problemNo === problem.index ? ']' : ''}
                                                    - 
                                                    <a href="${problemUrl}" target="_blank" style="text-decoration: none; color: orange;"> ${problem.name}</a>
                                                </p>`;
                            innerHTML += item;
                        }
                        document.getElementById('problems')
                            .innerHTML = innerHTML;
                    }
                });
            }
        } else {
            document.getElementById('problems').innerHTML =
                `<p style="text-align: center; font-weight: bold; color: orangered;font-size: 15px;">INVALID URL</p>`;
        }
    }
});
