--Pattern matching--
head' :: [a] -> a
head' [] = error "What the fuck is this?"
head' (x:_) = x

length' :: (Num b) => [a] -> b
length' [] = 0
length' (_:xs) = 1 + length' xs

sum' :: (Num b) => [a] -> b
sum' [] = 0
sum' [x:xs] = x + sum' xs

--Guards--
max' :: (Ord a) => a -> a -> a
max' a b
	| a > b = a
	| otherwise b

compare' :: (Ord a) => a -> a -> Ordering
x `compare'` y
	| x < y = LT
	| x > y = GT
	|  otherwise EQ

--Where clause--
bmiTest :: (RealFloat a) => a -> a -> String
bmiTest weight height
	| bmi <= skinny = "under"
	| bmi <= normal = "normal"
	| bmi <= fat 	= "over"
	| otherwise 	= "Fat Fuck"
	where 	bmi = weight / height ^ 2
			(skinny, normal, fat) = (18.5, 25.0, 30.0)

initials :: (String a) => a -> a -> a
initials f:_ l:_ = [f] ++ ". " ++ [l] ++ "."

calcBmis :: (RealFloat a) => [(a,a)] -> [a]
calcBmis xs = [bmi w h | (w, h) <- xs]
	where bmi weight height = weight / height ^2

--let clause--
calcBmis' :: (RealFloat a) => [(a,a)] -> a
calcBmis' xs = [bmi | (w,h) <- xs, let bmi = w / h ^ 2]

cylinder :: (RealFloat a) => a -> a -> a
cylinder r h =
	let sideArea = 2 * pi * r * h
		topArea = pi * r ^ 2
	in sideArea + 2 * topArea

descibeList :: [a] -> String
descibeList xs = "The list is " ++ case xs of [] -> "empty."
											  [x] -> "a singleton list."
											  xs -> "a longer list."

descibeList' :: [a] -> String
descibeList' xs = "The list is " ++ what xs
	where what [] = "empty."
		  what [x] = "a singleton list."
		  what xs = "a longer list."