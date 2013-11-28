-- projectEuler7.hs
-- Ian Feeley

{-Project Euler # 7
By listing the first six prime numbers: 2, 3, 5, 7, 11, and 13, we can see that the 6th prime is 13.

What is the 10,001st prime number?
-}
main = do
	print (nthPrime 10001)

primes = 2 : 3 : ([5,7..] `minus` unionAll [[p*p, p*p+2*p..] | p <- tail primes])

nthPrime :: Integer -> Integer
nthPrime n = primes !! n

euler (p : xs) = p : euler (xs `minus` map (*p) (p : xs))

minus :: Ord a => [a] -> [a] -> [a]
minus [] _ = []
minus xs [] = xs
minus l1@(x:xs) l2@(y:ys)
    | x > y = minus l1 ys
    | x < y = x : minus xs l2
    | otherwise = minus xs l2