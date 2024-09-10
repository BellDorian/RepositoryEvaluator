import { OpenAI } from "openai";
import { Repository } from "../Types/DataTypes";
import { resolve } from "path";

/**
 * Tim Carpenter
 *
 * Evaluates the license compatibility score of a repository using the OpenAI API
 *
 * @template T - The type of the data stored in the repository (generic)
 * @param {Repository<T>} repo - The repository to be evaluated
 * @returns 0 - License is incompatible
 * @returns 1 - License is compatible
 *
 */
export function licenseFunction<T>(repo: Repository<T>): number {
  const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Make sure to set API key in environment variables
  });
  var result: number;
  var answer = 'placeholder';

  try {
    openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: `Is LGPL v2.1 compatible with ${repo.queryResult?.licenseInfo?.name}? Answer using yes or no` }],
    })
    .then(response => {
      const answer = response.choices[0]?.message?.content;
      //console.log(`"${answer}"`)
    })

    if(answer == 'Yes' || answer == 'Yes.'){
      console.log('1');
      return 0;
    }
    else if(answer == 'No' || answer == 'No.'){
      console.log('0');
      return 0;
    }
    else{
      console.log('License may or may not be compatible');
      return 0;
    }
  } catch (error) {
    console.error("Error using API:", error);
  }

  return 0;
}