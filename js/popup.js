// Initialize button with user's preferred color
const fetchCodeforcesContestInfo = async (contestId) => {
    const response = await fetch(`https://codeforces.com/api/contest.standings?contestId=${contestId}&from=1&count=1`);
    return await response.json();
}

chrome.tabs.query({active: true, currentWindow: true})
    .then((tab) => {
            if (tab.length > 0) {
                const url = tab[0].url;
                const CODEFORCES_CONTEST = /https:\/\/codeforces.com\/contest\/\d+/g;
                const CODEFORCES_CONTEST_PROBLEM = /https:\/\/codeforces.com\/contest\/\d+\/problem\/[A-Za-z][0-9]*/g;
                if (url.search(CODEFORCES_CONTEST_PROBLEM) === 0 || url.search(CODEFORCES_CONTEST) === 0) {
                    const contestIdArr = url.match(/\d+/);
                    if (contestIdArr.length > 0) {
                        const contestId = contestIdArr[0];
                        const parts = url.split('\/');
                        let problemNo = null;
                        if (parts.length === 7) problemNo = parts[parts.length - 1];

                        fetchCodeforcesContestInfo(contestId)
                            .then(contest => {
                                console.log(contest);
                                if (contest.status === 'OK') {
                                    const result = contest.result;
                                    const problems = result.problems;

                                    let problemItem = ``;
                                    for (let i = 0, ln = problems.length; i < ln; i++) {
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
                                        problemItem += item;
                                    }
                                    document.getElementById('problems')
                                        .innerHTML = problemItem;
                                }
                            });
                    }
                } else {
                    const INVALID_URL = `<p style="text-align: center; font-weight: bold; color: orangered;font-size: 15px;">INVALID URL</p>`;
                    document.getElementById('problems').innerHTML = INVALID_URL;
                }
            }
        }
    );
