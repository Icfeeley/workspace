-- projectEuler6.hs
-- Ian Feeley

{-Project Euler #6


The sum of the squares of the first ten natural numbers is,
12 + 22 + ... + 102 = 385

The square of the sum of the first ten natural numbers is,
(1 + 2 + ... + 10)2 = 552 = 3025

Hence the difference between the sum of the squares of the first ten natural 
numbers and the square of the sum is 3025 − 385 = 2640.

Find the difference between the sum of the squares of the first one hundred 
natural numbers and the square of the sum.
-}

main = do
	print (diffOfSquareSums 100)

sumOfSquares :: Integer -> Integer
sumOfSquares n = sum( map (^2) [1..n])

squareOfSum :: Integer -> Integer
squareOfSum n = sum[1..n] ^2

diffOfSquareSums :: Integer -> Integer
diffOfSquareSums n = (squareOfSum n) - (sumOfSquares n)
