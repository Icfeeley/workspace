% Hw10_Prolog_Programming.pl
% Ian Feeley
% Nov. 22, 2013

% 1.
% a predicate that adds an element to the front of a given list.
add(E,L,[E|L]).

% 2.
% a predicate that takes a list and returns true if that list has an even length.
evenlength([]).
evenlength([_,_]).
evenlength([_,_|X]) :- evenlength(X).

%a predicate that takes a list and returns true if that list has an odd length.
oddlength([_]).
oddlength([_,_|X]) :- oddlength(X).

% 4.
% a predicate that takes a list and an element and returns true if that element
% is the last element in the list.
last1(L,E) :- append(_,E,L), length(E,1).

% 5.
% apredicate that takes two lists and returns true if the first list is a sublist 
% of the second list.
sublist(S,L) :- append(S,_,L).