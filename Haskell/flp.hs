main = do
	let list = [1,2,3,4,5,6,7,8,9,0]
	let num = 1337
	print (removeOdd list)
	print (listSum list)
	print (digits num)

removeOdd :: (Integral a) => [a] -> [a]
removeOdd [] = []
removeOdd [x] = if isOdd (head [x]) == True then [] else [x]
removeOdd (x:xs) 
	| isOdd x == True = removeOdd xs
	| otherwise = x : removeOdd xs

isOdd :: (Integral a) => a -> Bool
isOdd n = if n `mod` 2 == 0 then False else True

listSum :: (Integral a) => [a] -> a
listSum [] = 0
listSum [x] = x
listSum (x:xs) = x + listSum xs

digits :: (Integral a) => a -> a
digits x = if x `div` 10 == 0 then 1 else 1 + digits (x `div` 10)

ithDigit :: (Integral a) => a -> a -> a
ithDigit n i = if i == 0 then i `mod` 10 else ithDigit (n `div` 10) (i-1)

occurrances :: (Integral a) => a -> a -> a
occurrances i n
	| (div i 10) == 0 and i == n = 1
	| div i 10 = 0
	| (mod i 10) == n = 1 + occurrances (i `div` 10) n
	| otherwise = occurrances (i `div` 10) n