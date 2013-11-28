import Data.Char
import Data.List

main = do 
 	let prompt1 = "What type of variable notation do you want?Enter 0 for camcel case, 1 for snake case, or 2 for upper snake case: "
	let prompt2 = "Enter your varialbe name: "
	putStrLn prompt1
--	caseType <- getLine
	putStrLn prompt2
	var <- getLine
	let output1 = toUpperSnake var
	let output2 = toSnake var
	let output3 = makeCamelCase var
	let output4 = makeFUUUUUUCK var

	putStrLn output1
	putStrLn output2
	putStrLn output3
	putStrLn output4


--converts unformated string name to upper snake case ie "hello world" = "HELLO_WORLD"
toUpperSnake x
	| x == "" = ""
	| (head x) == ' ' = toUpperSnake (tail x)
	| ' ' `elem` x = toUpperSnake (map (replace (== ' ') '_') x)
	| (filter (`elem` ['a'..'z']) x) /= "" = toUpperSnake(map toUpper x)
	| otherwise = x

toSnake x
	| x == "" = ""
	| (head x) == ' ' = toSnake (tail x)
	| ' ' `elem` x = toSnake (map (replace (== ' ') '_') x)
	| (filter (`elem` ['A'..'Z']) x) /= "" = toSnake(map toLower x)
	| otherwise = x

makeSnakeCase :: String -> String
makeSnakeCase =
	intercalate "_" . words

makeFUUUUUUCK :: String -> String
makeFUUUUUUCK = 
	map toUpper . intercalate "_". words

makeCamelCase :: String -> String
makeCamelCase str = 
    let (w:ws) = words str
    in concat . (w :) $ map (\(c:cs) -> toUpper c : cs) ws

replace :: (a -> Bool) -> a -> a -> a
replace f r x = if f x then r else x
