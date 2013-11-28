-- Fizzbuzz.hs
-- Ian Feeley

{-
For values 0..n returns fizz for values that are evenly divisible by 3, 
buzz for values that are evenly divisible by 5, and fizzbuzz for values
evenly divisable by both 3 and 5.
-}

main = do
	--print ([x | x <- [0..100], x `mod` 3 == 0 || x `mod` 5 == 0 ])
	print (fizzbuzz 100)

fizzOrBuzz :: Integer -> String
fizzOrBuzz n
	| n `mod` 3 == 0 && n `mod` 5 == 0 = "Fizz-Buzz"
	| n `mod` 3 == 0 				   = "Fizz"
	| n `mod` 5 == 0 				   = "Buzz"
	| otherwise						   = ""

fizzbuzz :: Integer -> [String]
fizzbuzz n = [fizzOrBuzz x | x <- [0..n], x `mod` 3 == 0 || x `mod` 5 == 0]